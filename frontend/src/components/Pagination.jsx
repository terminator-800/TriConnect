// Gigamit nako ni para sa 'VerifiedUser' sa administrator
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const generatePageNumbers = () => {
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(start + 2, totalPages);
        if (end - start < 2 && start > 1) {
            start = Math.max(1, end - 2);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="flex justify-center mt-10 gap-2">
            
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-blue-700 cursor-pointer"
                    }`}
            >
                ◀
            </button>

            {generatePageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${page === currentPage
                        ? "bg-blue-700 text-white cursor-pointer"
                        : "bg-gray-200 text-gray-700 cursor-pointer"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-blue-700 cursor-pointer"
                    }`}
            >
                ▶
            </button>
        </div>
    );
};

export default Pagination;
