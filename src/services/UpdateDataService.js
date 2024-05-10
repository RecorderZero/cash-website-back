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
    updateRelatedProject(images, project_id) {
        let requests = [];
        
        for (let x = 0; x < images.length; x++) {
            let request = http.patch('/projectimage/' + images[x] + '/', {
                'related_project': project_id
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            requests.push(request);
        }
        return Promise.all(requests);
    }
    updateOrder(images, carouselNeedToMove999) {
        let requests = []
        // 更新有顯示的
        for (let x = 0; x < images.length; x++) {
            let order = x + 1
            let request = http.patch('/carouselimage/' + images[x].id + '/', {
                'order': order
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            requests.push(request)
        }
        // 更新未顯示的
        for (let x = 0; x < carouselNeedToMove999.length; x++) {
            let request = http.patch('/carouselimage/' + carouselNeedToMove999[x].id + '/', {
                'order': 999
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            requests.push(request)
        }
        return Promise.all(requests)
    }
    updateResource(resource) {
        let requests = [];
        
        for (let x = 0; x < resource.length; x++) {
            let resource_instance = resource[x]
            let request = http.patch('/membercount/' + resource_instance.id + '/', {
                'position': resource_instance.position,
                'count': resource_instance.count,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            requests.push(request);
        }
        return Promise.all(requests);
    }
}

export default new UpdateDataService();