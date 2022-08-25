import axios from 'axios';

const gitlab = {
    host: "",
    token: "",
    email: "",
    endPoints: {
        API: "/api/v4",
        SSH: "/user/keys"
    },
    getHeader(){
        return ({ "PRIVATE-TOKEN": this.token });
    },
    getDefaultOptions(){
        return ({ headers: this.getHeader()});
    },
    getUrlApi(){
        return this.host  + this.endPoints.API;
    },
    async listSSH(){
        const URL = this.getUrlApi() + this.endPoints.SSH;
        const options = this.getDefaultOptions();
        const { data } = await axios.get(URL, options);
        return data;
    },
    async createSSH(title, key, expires_at = null){
        const URL = this.getUrlApi() + this.endPoints.SSH;
        const options = this.getDefaultOptions();
        options.data = { title, key, expires_at };
        options.method = 'POST';
        options.url = URL;
        const { data } = await axios(options).catch( error => {
            console.log(error);
        });
        return data;
    },
    async deleteSSH( keyID ){
        const URL = this.getUrlApi() + this.endPoints.SSH  + '/' + keyID;
        const options = this.getDefaultOptions();
        const { data } = await axios.delete(URL, options);
        return data;
    },
};

export default gitlab;