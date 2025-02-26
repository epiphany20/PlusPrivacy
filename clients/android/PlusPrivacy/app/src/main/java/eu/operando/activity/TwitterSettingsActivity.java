package eu.operando.activity;

import android.content.Context;
import android.view.Menu;
import android.view.MenuInflater;

import com.google.gson.JsonElement;

import eu.operando.R;
import eu.operando.models.SocialNetworkEnum;
import eu.operando.models.privacysettings.OspSettings;
import eu.operando.network.RestClient;
import retrofit2.Call;

/**
 * Created by Alex on 1/18/2018.
 */

public class TwitterSettingsActivity extends SocialNetworkFormBaseActivity{

    @Override
    protected Call<JsonElement> getQuestionsBySN() {
        return RestClient.getApi().getTwitterSettings();
    }

    @Override
    protected Context getContext() {
        return TwitterSettingsActivity.this;
    }

    @Override
    public SocialNetworkEnum getSocialNetworkEnum() {
        return SocialNetworkEnum.TWITTER;
    }

    @Override
    protected Class getWebViewClass() {
        return TwitterWebViewActivity.class;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.twitter_menu, menu);
        return true;
    }
}
