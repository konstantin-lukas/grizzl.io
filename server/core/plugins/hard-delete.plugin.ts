const ONE_DAY = 1000 * 60 * 60 * 24;
const SOFT_DELETED_ENTITY_MAX_LIFETIME = ONE_DAY * 7;

export default defineNitroPlugin(() => {
    setInterval(async () => purgeAll({ maxAge: SOFT_DELETED_ENTITY_MAX_LIFETIME }), ONE_DAY);
});
