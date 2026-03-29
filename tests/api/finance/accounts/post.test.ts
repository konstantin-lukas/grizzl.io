import { makeAccountTestBuilder } from "~~/test-utils/playwright/utils/helpers/finance";

const testBuilder = makeAccountTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .ignoresAnyProvidedIdForDeterminingOwnership()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();
