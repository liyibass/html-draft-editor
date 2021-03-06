import get from 'lodash/get'
import merge from 'lodash/merge'
import pick from 'lodash/pick'

const _ = {
    get,
    merge,
    pick,
}

const imageApiDataEmpty = {
    url: '',
    original: {
        url: '',
        width: 0,
        height: 0,
    },
    desktop: {
        url: '',
        width: 0,
        height: 0,
    },
    tablet: {
        url: '',
        width: 0,
        height: 0,
    },
    mobile: {
        url: '',
        width: 0,
        height: 0,
    },
    tiny: {
        url: '',
        width: 0,
        height: 0,
    },
}

function composeImageSet(imageObj = {}) {
    let resizedTargets = _.get(imageObj, 'resizedTargets')
    if (!resizedTargets) {
        return imageObj
    }
    let original = {
        url: imageObj.url,
        width: imageObj.width,
        height: imageObj.height,
    }
    let image = {}
    return _.merge(image, resizedTargets, {
        original: original,
        url: _.get(resizedTargets, ['mobile', 'url']),
        description: imageObj.description,
        keywords: imageObj.keywords,
        id: imageObj.id,
    })
}

export const parseImageAPIResponse = function (apiResponse) {
    let imageObj = _.get(apiResponse, ['fields', 'image'], {})
    const id = apiResponse.id
    const name = apiResponse.name
    const urlOriginal = apiResponse.urlOriginal
    const urlDesktopSized = apiResponse.urlDesktopSized
    const urlTabletSized = apiResponse.urlTabletSized
    const urlMobileSized = apiResponse.urlMobileSized
    const urlTinySized = apiResponse.urlTinySized
    const storedImageApiData = JSON.parse(apiResponse.imageApiData)

    let imageApiData = isStoredImageApiDataIsValid(storedImageApiData)
        ? storedImageApiData
        : imageApiDataEmpty

    // if (!storedImageApiData) {
    //     imageApiData = storedImageApiData
    // } else if (!storedImageApiData.original) {
    //     imageApiData = imageApiDataEmpty
    // } else {
    //     imageApiData = imageApiDataEmpty
    // }

    // !storedImageApiData || !storedImageApiData.original
    //     ? imageApiDataEmpty
    //     : storedImageApiData

    imageApiData.url = urlOriginal
    imageApiData.original.url = urlOriginal
    imageApiData.desktop.url = urlDesktopSized
    imageApiData.tablet.url = urlTabletSized
    imageApiData.mobile.url = urlMobileSized
    imageApiData.tiny.url = urlTinySized

    // for (const key in imageApiData) {
    //     if (key === 'url') continue
    //     imageApiData[key] = {
    //         ...imageApiData[key],
    //         width: imageApiData[key].width || '',
    //         height: imageApiData[key].height || '',
    //     }
    // }

    // console.log(imageApiData)

    let image = _.merge({}, imageObj, {
        ...imageApiData,
        id,
        name,
    })
    return composeImageSet(image)
}

export const parseAudioAPIResponse = function (apiResponse) {
    // let audio = _.get(apiResponse, ['fields', 'audio'], {})

    // audio = _.pick(audio, ['filetype', 'name', 'url'])

    // let coverPhoto = composeImageSet(
    //     _.get(apiResponse, ['fields', 'coverPhoto'], {})
    // )
    // let description = _.get(apiResponse, ['fields', 'description', 'html'], '')
    // let name = _.get(apiResponse, ['fields', 'name'], '')
    // audio = _.merge(audio, {
    //     id: apiResponse.id,
    //     coverPhoto,
    //     description,
    //     name,
    // })
    // return audio
    return apiResponse
}

function isStoredImageApiDataIsValid(storedImageApiData) {
    if (storedImageApiData) {
        const keys = Object.keys(storedImageApiData)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const currentKeyObject = storedImageApiData[key]

            if (currentKeyObject) {
                // storedImageApiData has "["url", "original", "desktop", "tablet", "mobile", "tiny"]" keys
                // console.log(currentKeyObject)

                // skip url key, only validate various size image
                if (key === 'url') continue

                // validate currentKey has {url, height, width}
                const subKeys = Object.keys(currentKeyObject)
                if (subKeys.length !== 3) {
                    return false
                }
            } else {
                return false
            }
        }

        return true
    } else {
        return false
    }
}
