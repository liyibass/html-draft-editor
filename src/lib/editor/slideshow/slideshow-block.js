// 'use strict';

// import { Slideshow } from '@twreporter/react-article-components/dist/components/article/index'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import AlignedWrapper from '../components/AlignedWrapper/AlignedWrapper'

import './customStyle.css'

import ENTITY_LIST from '../entities'
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import EditingBt from '../base/editing-bt'
import ImageSelector from '../components/ImageSelector'
import React from 'react'
import get from 'lodash/get'

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

const _ = {
    get,
}

export default class SlideshowBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
        this.slideshowRef = React.createRef()
    }

    _renderImageSelector(props) {
        return <ImageSelector {...props} />
    }

    render() {
        if (!this.state.data) {
            return null
        }

        let images = _.get(this.state.data, 'content', [])

        const EditBlock = this.state.editMode
            ? this._renderImageSelector({
                  apiPath: 'images',
                  isSelectionOpen: true,
                  onChange: this.onValueChange,
                  onFinish: this.toggleEditMode,
                  selectedImages: images,
                  selectionLimit: ENTITY_LIST.SLIDESHOW.slideshowSelectionLimit,
              })
            : null

        const prevArrow = (
            <div className="default-nav">
                <i className="fas fa-arrow-circle-left"></i>
            </div>
        )
        const nextArrow = (
            <div className="default-nav">
                <i className="fas fa-arrow-circle-right"></i>
            </div>
        )

        const properties = {
            duration: 5000,
            transitionDuration: 500,
            infinite: true,
            indicators: false,
            arrows: true,
            autoplay: true,
            pauseOnHover: true,
            prevArrow: prevArrow,
            nextArrow: nextArrow,
            onChange: (oldIndex, newIndex) => {},
        }

        return (
            <AlignedWrapper isEnlarged={this.props.blockProps.isEnlarged}>
                <div
                    className="slide-container"
                    style={{
                        width: '100%',
                        position: 'relative',
                        userSelect: 'none',
                        zIndex: '0',
                    }}
                    contentEditable={false}
                >
                    {this.PrefArrow}
                    <Slide {...properties} ref={this.slideshowRef}>
                        {images.map((image, index) => (
                            <div
                                key={`slideshow-${index}`}
                                className="each-slide"
                            >
                                <div
                                    className="image-wrapper"
                                    style={{
                                        // backgroundColor: 'GhostWhite',
                                        width: '100%',
                                        height: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.title}
                                        style={{
                                            width: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                <h6>{image.title}</h6>
                            </div>
                        ))}
                    </Slide>

                    <EditingBt onClick={this.toggleEditMode} />
                    {EditBlock}
                </div>
            </AlignedWrapper>
        )
    }
}
