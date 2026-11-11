const covers = import.meta.glob('../assets/covers/*', { eager: true, import: 'default' });

export function getCover(fileName) {
    if (!fileName) return null;
    return covers[`../assets/covers/${fileName}`] || null;
}
