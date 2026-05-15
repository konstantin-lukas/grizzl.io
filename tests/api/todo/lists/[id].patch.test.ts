import { makeTodoListTestBuilder } from "~~/test-utils/playwright/builders/todo";

const testBuilder = makeTodoListTestBuilder("patch");

testBuilder
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .onlyAllowsAUserToSoftDeleteTheirOwnResources()
    .onlyAllowsPatchingTheDeletedProperty()
    .onlySoftDeletesTheRequestedResource()
    .allowsUndoingADelete()
    .build();
