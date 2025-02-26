export const getUserConnectionStatus = (type: string) => {
    switch (type) {
        case 'email':
            return {
                title: 'Update Profile',
                desc: 'Update your profile to attact more brands and collaboration opportunities!',
                labelButton: 'Update',
                redirecTo: 'edit-profile'
            }
        case 'facebook':
            return {
                title: 'Connect Your Facebook',
                desc: 'Connect with Facebook to access complete audience demographics data',
                labelButton: 'Connect',
                redirecTo: 'connect-social-account'
            }
        default:
            break;
    }

}