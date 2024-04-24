import http from "../http-common"

class UpdateRelatedNewService {
    update(images, new_id) {
        let requests = [];
        
        for (let x = 0; x < images.length; x++) {
            let request = http.patch('/newimage/' + images[x] + '/', {
                'related_new': new_id
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            requests.push(request);
        }
        return Promise.all(requests);
    }
}

export default new UpdateRelatedNewService();