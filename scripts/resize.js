const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')
const resizeImg = require('resize-img')


const RESIZE_WIDTH = 150
const RESIZE_HEIGHT = 150

const targetFolders = ['avatar']


async function convertImage(imageFile, targetFolder) {
    try {
        const imageFilePath = path.resolve(__dirname, `../${targetFolder}/` + imageFile)

        const imageSize = await sizeOf(imageFilePath)

        const imageFileExt= imageFile.split('.')[1]

        if (imageSize.width !== RESIZE_WIDTH || imageSize.height !== RESIZE_HEIGHT || imageFileExt !== 'png') {
            const imageFileName = imageFile.split('.')[0]
            console.log(`start convert ${imageFilePath}...`)
            const image = await resizeImg(fs.readFileSync(imageFilePath), {
                width: RESIZE_WIDTH,
                height: RESIZE_HEIGHT,
                format: 'png'
            })

            // write to png file
            fs.writeFileSync(
                path.resolve(__dirname, `../${targetFolder}/` + imageFileName + '.png'),
                image
            )

            console.log(`${imageFile} resize to ${RESIZE_WIDTH}x${RESIZE_HEIGHT} success.`)

            // remove origin img, if img type isn't png
            if(imageFileExt !== 'png') {
                fs.unlinkSync(imageFilePath)
                console.log(`${imageFilePath} delete success.`)
            }

        }
    } catch (err) {
        console.log(err)
    }
}




targetFolders.map(folder => {

    const projectImgDirPath = path.resolve(__dirname, `../${folder}/`)

    fs.readdir(projectImgDirPath, (err, files) => {
        console.log(`start convert ${folder}/ images...`)

        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err)
        }
        //listing all files using forEach
        files.forEach(async function (file) {
            try {
                convertImage(file, folder)
            } catch (err) {
                console.log(err)
            }
        })
    })

})