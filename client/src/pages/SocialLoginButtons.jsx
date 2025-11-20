import React from 'react'
import GoogleLoginButton from './GoogleLoginButton'
import LinkedInLoginButton from './LinkedInLoginButton'
import { Link } from 'react-router-dom'

const SocialLoginButtons = () => {
    return (
        <div className="row">
            <div className="col-6 mb-2 mb-sm-0">
                <GoogleLoginButton />
            </div>
            <div className="col-6">
                <LinkedInLoginButton />
            </div>
        </div>
    )
}

export default SocialLoginButtons