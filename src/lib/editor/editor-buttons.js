// 'use strict'

import { Button } from '@arch-ui/button'

import React from 'react'
import map from 'lodash/map'

import ENTITY_LIST from './entities'
import StyleButton from './editorButtons/StyleButton/StyleButton'
import AnnotationBt from './annotation/annotation-bt'
import AudioButton from './audio/audio-bt'
import VideoButton from './video/video-bt'
import BlockQuoteBt from './quote/block-quote-bt'
import EmbeddedCodeBt from './embedded-code/embedded-code-bt'
import ImageButton from './image/image-button'
import ImageLinkButton from './image-link/image-link-bt'
import InfoBoxBt from './info-box/info-box-bt'
import LinkButton from './link/link-button'
import YoutubeBt from './youtube/youtube-bt'

const _ = {
    map,
}

// class StyleButton extends React.Component {
//     constructor() {
//         super()
//         this.onToggle = (e) => {
//             e.preventDefault()
//             this.props.onToggle(this.props.style)
//         }
//     }

//     render() {
//         let className = ''
//         if (this.props.active) {
//             className += ' RichEditor-activeButton'
//         }

//         const icon = this.props.icon ? (
//             <i className={'fa ' + this.props.icon}></i>
//         ) : null

//         return (
//             <Button
//                 type="default"
//                 className={className + ' tooltip-box'}
//                 onClick={this.onToggle}
//                 data-tooltip={this.props.label}
//                 size="normal"
//                 style={{ marginLeft: '0' }}
//             >
//                 {icon}
//                 <span>{this.props.text}</span>
//             </Button>
//         )
//     }
// }

export const BlockStyleButtons = ({ buttons, editorState, onToggle }) => {
    const selection = editorState.getSelection()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType()

    return (
        <span className="button-groups">
            {_.map(buttons, (button) => (
                <StyleButton
                    key={button.label}
                    active={button.style === blockType}
                    onToggle={onToggle}
                    iconClassName={button.icon}
                    label={button.label}
                    style={button.style}
                    text={button.text}
                />
            ))}
        </span>
    )
}

export const InlineStyleButtons = ({ buttons, editorState, onToggle }) => {
    let currentStyle = editorState.getCurrentInlineStyle()

    return (
        <span className="button-groups">
            {_.map(buttons, (button) => (
                <StyleButton
                    key={button.label}
                    active={currentStyle.has(button.style)}
                    label={button.label}
                    onToggle={onToggle}
                    style={button.style}
                    iconClassName={button.icon}
                    text={button.text}
                />
            ))}
        </span>
    )
}

export const EntityButtons = (props) => {
    const { editorState, entities } = props
    const selection = editorState.getSelection()
    const startOffset = selection.getStartOffset()
    const startBlock = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())

    const endOffset = selection.getEndOffset()
    let data
    let entityInstance
    let entityKey
    let selectedText = ''

    if (!selection.isCollapsed()) {
        const blockText = startBlock.getText()
        selectedText = blockText.slice(startOffset, endOffset)
        entityKey = startBlock.getEntityAt(startOffset)
    } else {
        entityKey = startBlock.getEntityAt(0)
    }

    const contentState = editorState.getCurrentContent()
    if (entityKey !== null) {
        entityInstance = contentState.getEntity(entityKey)
        data = entityInstance.getData()
    }

    function _onToggle(entity, changedValue) {
        props.onToggle(entity, changedValue)
    }

    function chooseButton(entity) {
        let active = entityInstance
            ? entityInstance.getType() === entity
            : false
        let onToggle = _onToggle.bind(null, entity)
        switch (entity) {
            case ENTITY_LIST.BLOCKQUOTE.type:
                return (
                    <BlockQuoteBt
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        icon="fa fa-quote-right"
                        iconText=""
                        quote={data ? data.quote : selectedText}
                        quoteBy={data ? data.quoteBy : ''}
                    />
                )
            case ENTITY_LIST.ANNOTATION.type:
                return (
                    <AnnotationBt
                        active={active}
                        annotation={data ? data.annotation : ''}
                        draftRawObj={data ? data.draftRawObj : null}
                        icon="fas fa-edit"
                        iconText=""
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        text={data ? data.text : selectedText}
                    />
                )

            case ENTITY_LIST.LINK.type:
                return (
                    <LinkButton
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        url={data ? data.url : ''}
                        text={data ? data.text : selectedText}
                        icon="fas fa-link"
                        iconText=""
                    />
                )
            case ENTITY_LIST.INFOBOX.type:
                return (
                    <InfoBoxBt
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        title={data ? data.title : selectedText}
                        body={data ? data.body : ''}
                        icon=""
                        iconText="infobox"
                    />
                )
            case ENTITY_LIST.EMBEDDEDCODE.type:
                let embeddedCode = ''
                if (data) {
                    embeddedCode = data.embeddedCode || data.code
                    // data.code: for legacy post
                }

                return (
                    <EmbeddedCodeBt
                        active={active}
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        caption={data ? data.caption : ''}
                        embeddedCode={data ? embeddedCode : ''}
                        iconText=" Embed"
                    />
                )
            case ENTITY_LIST.AUDIO.type:
                return (
                    <AudioButton
                        active={active}
                        apiPath="audios"
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        icon="far fa-file-audio"
                        iconText=" Audio"
                    />
                )

            case ENTITY_LIST.VIDEO.type:
                return (
                    <VideoButton
                        active={active}
                        apiPath="videos"
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        icon="far fa-file-video"
                        iconText=" Video"
                    />
                )

            case ENTITY_LIST.IMAGE.type:
                return (
                    <ImageButton
                        active={active}
                        apiPath="images"
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        icon="far fa-image"
                        iconText=" Img"
                    />
                )
            case ENTITY_LIST.SLIDESHOW.type:
                return (
                    <ImageButton
                        active={active}
                        apiPath="images"
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        selectionLimit={
                            ENTITY_LIST.SLIDESHOW.slideshowSelectionLimit
                        }
                        icon="fa fa-images"
                        iconText=" Slideshow"
                    />
                )
            // case ENTITY_LIST.IMAGEDIFF.type:
            //     return (
            //         <ImageButton
            //             active={active}
            //             apiPath="images"
            //             key={entity}
            //             label={entity}
            //             onToggle={onToggle}
            //             selectionLimit={2}
            //             icon="fa fa-object-ungroup"
            //             // iconText=" Diff"
            //             iconText=" Diff"
            //         />
            //     )
            // case ENTITY_LIST.IMAGELINK.type:
            //     return (
            //         <ImageLinkButton
            //             active={active}
            //             desc={data ? data.desc : ''}
            //             key={entity}
            //             label={entity}
            //             onToggle={onToggle}
            //             url={data ? data.url : ''}
            //             icon="fas fa-external-link-alt"
            //             iconText=" ImgLink"
            //         />
            //     )

            case ENTITY_LIST.YOUTUBE.type:
                return (
                    <YoutubeBt
                        active={active}
                        description={data ? data.description : ''}
                        key={entity}
                        label={entity}
                        onToggle={onToggle}
                        icon="fab fa-youtube"
                        iconText=""
                        id={data ? data.id : ''}
                    />
                )
            default:
                return
        }
    }

    const buttons = entities.map((entity) => {
        const button = chooseButton(entity)
        return button
    })

    return <span className="button-groups">{buttons}</span>
}
