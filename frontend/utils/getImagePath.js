   const getImagePath = (user, filename) => {
        if (!filename || !user) return null;

        const role = user.role;
        const user_id = user.user_id;

        const name =
            role === "jobseeker"
                ? user.full_name
                : role === "individual_employer"
                    ? user.full_name
                    : role === "business_employer"
                        ? user.business_name
                        : role === "manpower_provider"
                            ? user.agency_name
                            : "unknown";

                            
        if (!name) return null;

        return `${import.meta.env.VITE_API_URL}/uploads/${role}/${user_id}/${encodeURIComponent(name)}/${filename}`;
    };

    
export default getImagePath;