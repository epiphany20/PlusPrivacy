package eu.operando.lightning.browser;

public interface TabsView {

    void tabAdded();

    void tabRemoved(int position);

    void tabChanged(int position);

    void tabsInitialized();
}
