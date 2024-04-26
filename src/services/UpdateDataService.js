import http from "../http-common"

class UpdateDataService {
    updateRelatedNew(images, new_id) {
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
    updateDisplay(idArray) {
        let requests = [];

        for(let x = 0; x < idArray.length; x++) {
            let request = http.patch('/carouselimage/' + idArray[x].id + '/', {
                'displayornot': idArray[x].displayornot
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

export default new UpdateDataService();