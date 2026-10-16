import { environment } from '../../environments/environment';

export class AppConstants {
    // Backend-API (…/backend/api/) — je nach Build-Umgebung Mockup oder Produktion
    public static get restURL(): string { return environment.apiUrl; }
    // Basis für hochgeladene Dateien (…/dataupload/)
    public static get fileBaseUrl(): string { return environment.fileBaseUrl; }
}
