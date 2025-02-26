package eu.operando.activity;


import android.webkit.CookieManager;
import android.webkit.WebViewClient;

import eu.operando.customView.MyWebViewClient;

/**
 * Created by Alex on 1/23/2018.
 */

public class TwitterWebViewActivity extends SocialNetworkPrivacySettingsWebViewActivity {

    public String getURL_MOBILE() {
        return "https://mobile.twitter.com/settings/safety";
    }

    public String getURL() {
        return "https://mobile.twitter.com/settings/safety";
    }

    @Override
    public WebViewClient getWebViewClient() {
        return new MyWebViewClient(this);
    }

    @Override
    public WebAppInterface getWebAppInterface() {
        return new WebAppInterface(this, privacySettingsString);
    }

    @Override
    public String getJsFile() {
        return "twitter.js";
    }

    @Override
    public String getIsLoggedJsFile() {
        return "twitter_is_logged.js";
    }

    @Override
    public void startInjecting() {

        if (!shouldInject) {

            if (!myWebView.getUrl().equals(getURL())) {
                myWebView.loadUrl(getURL());
            }

            if (android.os.Build.VERSION.SDK_INT >= 21) {
                CookieManager.getInstance().setAcceptThirdPartyCookies(myWebView, true);
            } else {
                CookieManager.getInstance().setAcceptCookie(true);
            }

            initProgressDialog();
            shouldInject = true;

            if (myWebView.getUrl().equals(getURL())) {
                onPageListener();
            }

        }
    }

    @Override
    public void onPageCommitVisible() {

    }

    public void onPageFinished() {
        onPageListener();

    }
}