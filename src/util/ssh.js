import terminal from './terminal.js';

const ssh = {
    async createSSH( comment ){
        const SSH_KEY = await terminal.execute("create_ssh_key.sh", comment, true);
        if ( typeof SSH_KEY == 'string' && SSH_KEY.includes(comment) ) {
            return SSH_KEY;
        }
        return null;
    }
}
const { createSSH } = ssh;
export {
    createSSH
};
export default ssh;