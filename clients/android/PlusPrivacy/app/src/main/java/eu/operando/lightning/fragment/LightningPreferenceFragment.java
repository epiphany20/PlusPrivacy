package eu.operando.lightning.fragment;

import android.os.Bundle;
import android.preference.PreferenceFragment;

import javax.inject.Inject;

import eu.operando.PlusPrivacyApp;
import eu.operando.lightning.preference.PreferenceManager;

/**
 * Simplify {@link PreferenceManager} inject in all the PreferenceFragments
 *
 * @author Stefano Pacifici
 * @date 2015/09/16
 */
public class LightningPreferenceFragment extends PreferenceFragment {

    @Inject
    PreferenceManager mPreferenceManager;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        PlusPrivacyApp.getAppComponent().inject(this);
    }
}
