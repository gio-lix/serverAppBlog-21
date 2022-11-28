export const imageUpload = async (images: any) => {
    let error = ""
    let success = ""

    const formData = new FormData()
    formData.append("file", images)
    formData.append("upload_preset", 'qmfpawft')
    formData.append("cloud_name", 'dlbipxxlr')

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dlbipxxlr/upload", {
            method: "POST",
            body: formData
        })
        const data: any = await res.json()
        success = data
    } catch (err: any) {
        error = err.message
    }

    return {error, success}
}


export const checkFileErr = (file: any) => {
    let err = ""

    if (!file)
        err = "File does not exist"

    if (file.size > 1024 * 1024)
        err = "The largest image size is 1mb."

    if (file.type !== "image/jpeg" && file.type !== "image/png")
        err = "Image format is incorrect."

    return err
}
