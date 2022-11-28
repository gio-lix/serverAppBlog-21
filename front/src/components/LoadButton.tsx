import React, {FC} from 'react';

interface Props {
    result: number
    handleLoadMore: any
    page: any
    load: boolean
}

const LoadButton: FC<Props> = ({handleLoadMore, page, result, load}) => {

    return (
        <>
            {
                result < 3 * (page - 1) ? " " :
                    !load && (
                        <button onClick={handleLoadMore} className="loadButton">
                            Load more
                        </button>
                    )
            }

        </>
    );
};

export default LoadButton;