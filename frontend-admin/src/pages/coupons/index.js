import CustomErrorCentered from "@/components/Errors/CustomErrorCentered";
import Layout from "@/components/Layout/AllLayout";
import LoadingCentered from "@/components/Loading/LoadingCentered";
import User from "@/components/Users/User";
import React from "react";
import useSWR, { useSWRConfig } from "swr";

function Coupons() {
	const { fetcher } = useSWRConfig();

	const { data: UsersData, error: UsersError } = useSWR("/api/v1/private/Admin/Users", fetcher);

	if (UsersError) return <CustomErrorCentered code={UsersError.status} message={UsersError.info.message} />;
	if (!UsersData) return <LoadingCentered />;

	return (
		<Layout>
			<div className="flex flex-col space-y-5">
				{UsersData.data.Users.length > 0 ? (
					<>
						{UsersData.data.Users.map((user) => {
							return <User key={user.id} user={user} />;
						})}
					</>
				) : (
					<div className="text-center font-light text-3xl">No users.</div>
				)}
			</div>
		</Layout>
	);
}

export default Coupons;
