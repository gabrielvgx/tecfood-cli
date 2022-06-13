const DockerMnemonicHelper = {
    resolveDockerImageMnemonics( ENV ){
        const ENV_MAP = Object.assign({}, ENV);
        const IMAGE_MNEMONICS = [
            { SERVICE_NAME: 'BIRT',      MNEMONIC_IMAGE_NAME: 'BIRT_IMAGE'     },
            { SERVICE_NAME: 'BASEDEV',   MNEMONIC_IMAGE_NAME: 'BASEDEV_IMAGE'  },
            { SERVICE_NAME: 'APP',       MNEMONIC_IMAGE_NAME: 'APP_IMAGE'      },
            { SERVICE_NAME: 'MONGO',     MNEMONIC_IMAGE_NAME: 'MONGO_IMAGE'    },
            { SERVICE_NAME: 'ALGORITMO', MNEMONIC_IMAGE_NAME: 'ALGORITMO_IMAGE'},
        ];
        IMAGE_MNEMONICS.forEach( MNEMONIC_STRUCTURE => {
            const { SERVICE_NAME, MNEMONIC_IMAGE_NAME } = MNEMONIC_STRUCTURE;
            const { REGISTRY, IMAGE, TAG} = ENV_MAP.SERVICES[SERVICE_NAME];
            let IMAGE_DESCRIPTION = (
                ( REGISTRY && IMAGE && TAG && `${REGISTRY}/${IMAGE}:${TAG}` ) || 
                ( REGISTRY && IMAGE &&        `${REGISTRY}/${IMAGE}`        ) ||
                (             IMAGE && TAG && `${IMAGE}:${TAG}`             ) ||
                (             IMAGE &&        `${IMAGE}`                    ) || 
                ''
            );
            ENV_MAP[MNEMONIC_IMAGE_NAME] = IMAGE_DESCRIPTION;
        });
        return ENV_MAP;
    },
    resolveDockerVolumesMnemnonics( ENV ){
        if ( ENV.BASEDEV_SSHPATH ) {
            ENV.BASEDEV_SSHPATH_VOLUME = `- ${ENV.BASEDEV_SSHPATH}:/root/.ssh`;
        } else {
            ENV.BASEDEV_SSHPATH_VOLUME = '';
        }
        if ( ENV.APP_SSHPATH ) {
            ENV.APP_SSHPATH_VOLUME = `- ${ENV.APP_SSHPATH}:/root/.ssh`;
        } else {
            ENV.APP_SSHPATH_VOLUME = '';
        }
    },
    run( ENV ){
        let NEW_ENV = Object.assign({}, ENV);
        Object.assign(NEW_ENV, this.resolveDockerImageMnemonics(NEW_ENV));
        Object.assign(NEW_ENV, this.resolveDockerVolumesMnemnonics(NEW_ENV));
        return NEW_ENV;
    }
};

export default DockerMnemonicHelper;