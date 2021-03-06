// 'use strict';
import React from 'react'
import PropTypes from 'prop-types'
import raf from 'raf' // requestAnimationFrame polyfill
import get from 'lodash/get'
import ReactPlayer from 'react-player/lazy'

const _ = {
    get,
}

class AudioItem extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playing: false,
            loaded: false,
        }
        this.handleToggle = this._handleToggle.bind(this)
        this.handleOnLoad = this._handleOnLoad.bind(this)
        this.handleOnEnd = this._handleOnEnd.bind(this)
        this.handleOnPlay = this._handleOnPlay.bind(this)
        this.renderSeekPos = this._renderSeekPos.bind(this)
    }

    componentWillUnmount() {
        this.clearRAF()
    }

    _handleToggle(e) {
        e.stopPropagation()
        this.setState({
            playing: !this.state.playing,
        })
    }

    _handleOnLoad() {
        this.setState({
            loaded: true,
            duration: this.player.duration(),
        })
    }

    _handleOnPlay() {
        this.setState({
            playing: true,
        })
        this.renderSeekPos()
    }

    _handleOnEnd() {
        this.setState({
            playing: false,
        })
        this.clearRAF()
    }

    _handleSelect(e) {
        e.stopPropagation()
        this.props.onSelect(e)
    }

    _renderSeekPos() {
        this.setState({
            seek: this.player.seek(),
        })
        if (this.state.playing) {
            this._raf = raf(this.renderSeekPos)
        }
    }

    clearRAF() {
        raf.cancel(this._raf)
    }

    render() {
        const {
            audio,
            coverPhoto,
            isSelected,
            name,
            description,
            width,
        } = this.props

        let style = {
            AudioItem: {
                border: isSelected ? '1px solid rgb(44,162,252)' : '',
                borderRadius: '10px',
                margin: '5px 0',
                boxSizing: 'border-box',
                display: 'inline-block',
                padding: '10px',
                width: `${width}%`,
            },
            infoTopic: {
                display: 'flex',
                flexDirection: 'row',
            },
        }
        return (
            <div
                onClick={this._handleSelect.bind(this)}
                style={style.AudioItem}
            >
                <ReactPlayer
                    url={audio}
                    controls={true}
                    width="100%"
                    height="20px"
                    style={{ margin: '5px 0' }}
                    light
                />
                <div className="info_container">
                    <div className="info_topic" style={style.infoTopic}>
                        {/* display coverPhoto (Todo) */}
                        {/* {coverPhoto ? (
                            <div className="cover_photo">
                                <img
                                    src={coverPhoto.url}
                                    alt={coverPhoto.name}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        ) : null} */}

                        <h5>{name}</h5>
                    </div>
                    <div className="info_detail">
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        )
    }
}

AudioItem.propTypes = {
    audio: PropTypes.string,
    coverPhoto: PropTypes.object,
    description: PropTypes.string,
    doShowRemove: PropTypes.bool,
    isSelected: PropTypes.bool,
    onRemove: PropTypes.func,
    onSelect: PropTypes.func,
    name: PropTypes.string,
    width: PropTypes.number.isRequired,
}

AudioItem.defaultProps = {
    audio: '',
    coverPhoto: null,
    description: '',
    doShowRemove: false,
    isSelected: false,
    name: '',
    width: 100,
}

class AudioGrid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            audios: props.audios,
            selectedAudios: props.selectedAudios,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            audios: nextProps.audios,
            selectedAudios: nextProps.selectedAudios,
        }
    }

    _handleSelect(audio) {
        // console.log(audio)
        this.props.onSelect(audio)
    }

    render() {
        const { audios, selectedAudios } = this.state
        const { columns } = this.props
        const width = Math.floor(100 / columns)
        const audioItems = audios.map((audio, index) => {
            const isSelected = selectedAudios.find((element) => {
                return element.id === audio.id
            })
                ? true
                : false
            return (
                <AudioItem
                    audio={_.get(audio, 'url')}
                    coverPhoto={_.get(audio, 'coverPhoto')}
                    description={_.get(audio, 'description')}
                    isSelected={isSelected}
                    key={audio.id}
                    onSelect={this._handleSelect.bind(this, audio)}
                    name={_.get(audio, 'name')}
                    width={width}
                />
            )
        })

        return <div className="audioGrid">{audioItems}</div>
    }
}

AudioGrid.propTypes = {
    audios: PropTypes.array.isRequired,
    columns: PropTypes.number,
    onSelect: PropTypes.func,
    padding: PropTypes.number,
    selectedAudios: PropTypes.array,
}

AudioGrid.defaultProps = {
    audios: [],
    columns: 3,
    padding: 10,
    selectedAudios: [],
}

export { AudioGrid, AudioItem }
