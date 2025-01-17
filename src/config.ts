import { OidcConfiguration } from "@axa-fr/react-oidc";

const configuration: OidcConfiguration = {
    client_id: process.env.SSO_CLIENT_ID || "",
    redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''
        }/authentication/callback`,
    scope: 'openid profile email offline_access',
    authority: process.env.SSO_AUTHORITY || "",
    silent_redirect_uri: `${window.location.protocol}//${window.location.hostname
        }${window.location.port ? `:${window.location.port}` : ''
        }/authentication/silent_callback`,
    service_worker_only: false,
    refresh_time_before_tokens_expiration_in_second: 10,
    demonstrating_proof_of_possession: false,
}

export default configuration;
