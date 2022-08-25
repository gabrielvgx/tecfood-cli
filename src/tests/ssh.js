import axios from 'axios';

const SSH = {
    hosApi: 'http://gitlab.teknisa.com/api/v4',
    endPoint: '/user/keys',
    getURL(){
        return this.hostApi + this.endPoint;
    },
    getToken(){
        return 'AXYCjbwHuNyxqZqJaKUB';
    },
    // {"headers":{"PRIVATE-TOKEN":"AXYCjbwHuNyxqZqJaKUB"}
    getHeader(){
        return ({
            'PRIVATE-TOKEN': this.getToken()
        });
    },
    getDefaultOptions(){
        return ({headers: this.getHeader()})
    },
    async get(){
        const resp = await axios.get(this.getURL(), this.getDefaultOptions());
        return resp.data;
    },
    async delete(keyID){
        const resp = await axios.delete(this.getURL() + `/${keyID}`, this.getDefaultOptions());
        return resp.data;
    },
    async add(title, key, expires_at = null){
        let options = this.getDefaultOptions();
        options.data = { title, key, expires_at };
        const resp = await axios.post(this.getURL(), options);
        return resp.data;
    },
    async create(){

    }
}

console.log(resp.data);