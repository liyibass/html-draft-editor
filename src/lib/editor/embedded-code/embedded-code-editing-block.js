import React from 'react'
import PropTypes from 'prop-types'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'

export class EmbeddedCodeEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
        this.state.editingFields = {
            caption: props.caption,
            embeddedCode: props.embeddedCode,
        }
    }

    // overwrite
    _composeEditingFields(props) {
        return {
            caption: {
                type: 'text',
                value: props.caption,
            },
            embeddedCode: {
                type: 'textarea',
                value: props.embeddedCode,
            },
        }
    }

    // overwrite
    _decomposeEditingFields(fields) {
        return {
            caption: fields.caption.value,
            embeddedCode: fields.embeddedCode.value,
        }
    }
}

EmbeddedCodeEditingBlock.displayName = 'EmbeddedCodeEditingBlock'

EmbeddedCodeEditingBlock.propTypes = {
    caption: PropTypes.string,
    embeddedCode: PropTypes.string,
    isModalOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    toggleModal: PropTypes.func,
}

EmbeddedCodeEditingBlock.defaultProps = {
    caption: '',
    embeddedCode: '',
    isModalOpen: false,
}

export default EmbeddedCodeEditingBlock
