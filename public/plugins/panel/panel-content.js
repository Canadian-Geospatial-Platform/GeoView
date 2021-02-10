import React, { useEffect, useState } from 'react';

const PanelContent = (props) => {
    const [vectors, setVectors] = useState({});

    const { cgpv } = window;
    const { mapId } = props;

    const deleteVector = (id) => {
        cgpv.api.map(mapId).deleteGeometry(id);

        setVectors(
            Object.assign(
                {},
                Object.values(vectors).filter((vector) => vector.id !== id)
            )
        );
    };

    useEffect(() => {
        // load existing vectors
        const { layers } = cgpv.api.map(mapId);

        const prevVectors = {};

        layers.forEach((vector) => {
            const { id } = vector;

            prevVectors[id] = {
                id: vector.id,
                layer: vector.layer,
                type: vector.type,
                mapId: vector.handlerName,
            };
        });

        setVectors(prevVectors);
    }, []);

    useEffect(() => {
        // listen to newely added vectors
        cgpv.api.on('vector/added', (payload) => {
            const { id } = payload;

            setVectors({
                ...vectors,
                [id]: {
                    id: payload.id,
                    layer: payload.layer,
                    type: payload.type,
                    mapId: payload.handlerName,
                },
            });
        });

        return () => {
            cgpv.api.off('vector/added');
        };
    });

    return (
        <div>
            {Object.keys(vectors).map((key) => {
                const vector = vectors[key];
                return (
                    <div key={vector.id}>
                        <p>Vector ID: {vector.id}</p>
                        <p>Vector Type: {vector.type}</p>
                        <button type="button" onClick={() => deleteVector(vector.id)}>
                            Delete vector
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default PanelContent;
