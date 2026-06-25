import { makePollTestBuilder } from "~~/test-utils/playwright/builders/poll";

const testBuilder = makePollTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .ignoresAnyProvidedIdForDeterminingOwnership()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();
