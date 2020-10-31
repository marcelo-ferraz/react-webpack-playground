export default function contextReducer(state, { type, payload }) {
    switch (type) {
        case 'save-project':
            return payload;
        case 'rename-entry':
            const { oldKey, newKey } = payload;
            const value = state.entries[oldKey];
            delete state.entries[oldKey];
            return {
                ...state,
                entries: {
                    ...state.entries,
                    [newKey]: value,
                },
            };
        case 'save-entry':
            return {
                ...state,
                entries: {
                    ...state.entries,
                    ...payload,
                },
            };
        default:
            return state;
    }
}
