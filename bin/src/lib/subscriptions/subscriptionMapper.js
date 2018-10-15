const _ = require('lodash');
const { withFilter } = require('graphql-subscriptions');
const { evalWithContext } = require('../util/filterEvaluator')();
const { log } = require('../util/logger');
module.exports = function mapSubscriptions(subsciptionMappings, pubsub) {
    const resolvers = {};
    _.forEach(subsciptionMappings, (subscriptionMapping) => {
        const subscriptionMappingName = subscriptionMapping.field;
        if (_.isEmpty(subscriptionMapping.topic)) {
            subscriptionMapping.topic = subscriptionMappingName;
        }
        if (subscriptionMapping.type !== 'Subscription') {
            throw Error(`subscriptionMapping ${subscriptionMappingName} has incorrect type. It must be 'Subscription'`);
        }
        let resolver = {};
        if (subscriptionMapping.filter) {
            resolver = {
                subscribe: withFilter(() => pubsub.getAsyncIterator(subscriptionMapping.topic), (payload, variables) => {
                    try {
                        let { filter } = subscriptionMapping;
                        log.info('Evaluating Subscription filter', { filter, payload, variables });
                        return evalWithContext(filter, { payload, variables });
                    }
                    catch (error) {
                        log.error('error evaluating subscription filter', error, subscriptionMapping.filter);
                        return error;
                    }
                })
            };
        }
        else {
            resolver = {
                subscribe: () => {
                    return pubsub.getAsyncIterator(subscriptionMapping.topic);
                }
            };
        }
        resolvers[subscriptionMapping.type] = resolvers[subscriptionMapping.type] || {};
        resolvers[subscriptionMapping.type][subscriptionMappingName] = resolver;
    });
    return resolvers;
};
//# sourceMappingURL=subscriptionMapper.js.map