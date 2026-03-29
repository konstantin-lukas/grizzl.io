import { makeAccountTestBuilder } from "~~/test-utils/playwright/utils/helpers/finance";

const testBuilder = makeAccountTestBuilder("patch");

testBuilder
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlySoftDeletesTheRequestedResource()
    .allowsUndoingADelete()
    .build();
