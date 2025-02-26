package eu.operando.androidsdk.eula.visitor;

import eu.operando.androidsdk.eula.visitedparts.AccessFrequencyPartTextBuilder;
import eu.operando.androidsdk.eula.visitedparts.DownloadDataPartTextBuilder;
import eu.operando.androidsdk.eula.visitedparts.IntroPartTextBuilder;
import eu.operando.androidsdk.eula.visitedparts.SensorPartTextBuilder;
import eu.operando.androidsdk.eula.visitedparts.UserControlPartTextBuilder;

/**
 * Created by Matei_Alexandru on 13.10.2017.
 * Copyright © 2017 RomSoft. All rights reserved.
 */

public class TextBuilderDisplayVisitor implements ITextBuilderVisitor {

    private StringBuilder result;

    public TextBuilderDisplayVisitor() {
        result = new StringBuilder();
    }

    @Override
    public void visit(AccessFrequencyPartTextBuilder accessFrequencyPartTextBuilder) {
        result.append(accessFrequencyPartTextBuilder.build());
    }

    @Override
    public void visit(DownloadDataPartTextBuilder downloadDataPartTextBuilder) {
        result.append(downloadDataPartTextBuilder.build());
    }

    @Override
    public void visit(SensorPartTextBuilder sensorPartTextBuilder) {
        result.append(sensorPartTextBuilder.build());
    }

    @Override
    public void visit(UserControlPartTextBuilder userControlPartTextBuilder) {
        result.append(userControlPartTextBuilder.build());
    }

    @Override
    public void visit(IntroPartTextBuilder introPartTextBuilder) {
        result.append(introPartTextBuilder.build());
    }

    public String getResult() {
        return result.toString();
    }
}
