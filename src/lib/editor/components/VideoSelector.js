import React from 'react'
import PropTypes from 'prop-types'

import {
    parseVideoAPIResponse,
    parseImageAPIResponse,
} from '../utils/parseAPIResponse'
import { Button } from '@arch-ui/button'
import Dialog from '@arch-ui/dialog'
import { Pagination } from '@arch-ui/pagination'

import VideoSelection from './VideoSelection'
import SelectorMixin from './mixins/SelectorMixin'

// // lodash
// import forEach from 'lodash/forEach'
// import get from 'lodash/get'
// import merge from 'lodash/merge'
// import set from 'lodash/set'

// const _ = {
//     forEach,
//     get,
//     merge,
//     set,
// }

const PAGINATION_LIMIT = 10

export class VideoSelector extends SelectorMixin {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            selectedItems: props.selectedVideos,
            isSelectionOpen: props.isSelectionOpen,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            // selectedItems: nextProps.selectedVideos,
            isSelectionOpen: nextProps.isSelectionOpen,
        }
    }

    loadItems(querystring = '') {
        return new Promise((resolve, reject) => {
            const dataConfig = {
                list: 'Video',
                columns: [
                    'name',
                    'url',
                    'youtubeUrl',
                    'coverPhoto{id,name,urlOriginal}',
                ],
                maxItemsPerPage: 12,
            }

            // call loadItemsFromGql in SelectorMixin
            this.loadItemsFromCMS(querystring, dataConfig)
                .then((items) => {
                    // items.map((video) => {
                    //     // format fetched data's format
                    //     video.coverPhoto = parseImageAPIResponse(
                    //         audio.coverPhoto
                    //     )
                    // })
                    resolve(items)
                })
                .catch((err) => reject(err))
        })
    }

    render() {
        if (this.state.error) {
            return <span>There is an error, please reload the page.</span>
        }

        const { isSelectionOpen, items, selectedItems } = this.state
        return (
            <Dialog
                heading="Select Video"
                isOpen={isSelectionOpen}
                onClose={this.handleCancel}
                closeOnBlanketClick
                width={1000}
            >
                <div className="VideoSelector Selector">
                    <div className="Selector__container">
                        {this._renderSearchFilter()}
                        <VideoSelection
                            Videos={items}
                            selectedVideos={selectedItems}
                            selectionLimit={this.props.selectionLimit}
                            updateSelection={this.updateSelection}
                        />
                        <Pagination
                            currentPage={this.state.currentPage}
                            pageSize={this.PAGE_SIZE}
                            total={this.state.total}
                            onChange={this.handlePageSelect}
                            limit={PAGINATION_LIMIT}
                        />
                    </div>

                    <div className="Selector__button">
                        <Button type="primary" onClick={this.handleSave}>
                            Save
                        </Button>
                        <Button type="link-cancel" onClick={this.handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

VideoSelector.propTypes = {
    apiPath: PropTypes.string,
    isSelectionOpen: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    selectedVideos: PropTypes.array,
    selectionLimit: PropTypes.number,
}

VideoSelector.defaultProps = {
    apiPath: '',
    isSelectionOpen: false,
    selectedVideos: [],
    selectionLimit: 1,
}

export default VideoSelector
