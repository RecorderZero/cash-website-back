import http from "../http-common"

class UploadFilesService {
    upload(files) {
        let formData = new FormData();
        for (let x = 0; x < files.length; x++) {
            formData.append("image", files[x]);
        }
        // formData.append("related_new", 1)
        return http.post('/newimage/', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

    // getFiles() {
    //     return http.get("/files")
    // }
}

export default new UploadFilesService();