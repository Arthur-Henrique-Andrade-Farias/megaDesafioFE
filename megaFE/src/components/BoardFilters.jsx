import React from 'react';

const priorityOptions = [
    { value: 'all', label: 'Todas Prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' },
];

const sortOptions = [
    { value: 'padrao', label: 'Padrão' },
    { value: 'alfabetica', label: 'Alfabética (A-Z)' },
];

const BoardFilters = ({
    priorityFilter,
    onPriorityFilterChange,
    sortCriteria,
    onSortChange,
    searchTerm,
    onSearchTermChange,
    onClearFilters,
    onApplyFilters, 
}) => {
    return (
        <div className="board-filters">
            <div className="filter-group">
                <label htmlFor="search-term">Buscar Título:</label>
                <input
                    type="text"
                    id="search-term"
                    className="filter-input"
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                />
            </div>
            <div className="filter-group">
                <label htmlFor="priority-filter">Prioridade:</label>
                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => onPriorityFilterChange(e.target.value)}
                    className="filter-select"
                >
                    {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="sort-criteria">Ordenar Por:</label>
                <select
                    id="sort-criteria"
                    value={sortCriteria}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="filter-select"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filter-group-buttons">
                 <button onClick={onApplyFilters} className="btn btn-primary">
                    Aplicar Filtros
                </button>
                <button onClick={onClearFilters} className="btn btn-secondary">
                    Limpar Filtros
                </button>
            </div>
        </div>
    );
};

export default BoardFilters;