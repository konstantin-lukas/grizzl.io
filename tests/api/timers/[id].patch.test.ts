import { makeTimerTestBuilder } from "~~/test-utils/playwright/utils/helpers/timer";

const testBuilder = makeTimerTestBuilder("patch");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlySoftDeletesTheRequestedResource()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .allowsUndoingADelete()
    .build();
