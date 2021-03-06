// 'use strict';

import { CompositeDecorator } from 'draft-js'
import React from 'react' // eslint-disable-line no-unused-vars
import annotationDecorator from './annotation/annotation-decorator'
import linkDecorator from './link/link-decorator'
// import quoteDecorator from './blockquote(NO_USE)/blockquote-decorator'

const decorator = new CompositeDecorator([
    annotationDecorator,
    linkDecorator,
    // quoteDecorator,
])

export default decorator
