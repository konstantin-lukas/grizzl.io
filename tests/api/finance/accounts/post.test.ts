import { makeAccountTestBuilder } from "~~/test-utils/playwright/builders/finance";

const testBuilder = makeAccountTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .ignoresAnyProvidedIdForDeterminingOwnership()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();
