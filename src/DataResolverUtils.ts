export class ResolverUtils {

    static groupByMany<T>(originalIds: (string|number)[], entities: T[], property: keyof T|((entity: T) => any)): T[][] {
        const group: { [id: string]: T[] } = originalIds.reduce((group, id) => {
            group[id] = [];
            return group;
        }, {} as any);
        entities.forEach(entity => {
            const value: any = property instanceof Function ? property(entity) : property;
            if (value instanceof Array) {
                value.forEach(propertyId => {
                    if (group[propertyId]) // handle situation when there is a property id without group?
                        group[propertyId].push(entity);
                });
            }
        });
        return originalIds.map(id => group[id]);
    }

}