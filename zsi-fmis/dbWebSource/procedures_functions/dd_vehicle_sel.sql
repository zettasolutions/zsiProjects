CREATE PROCEDURE [dbo].[dd_vehicle_sel]
(
   @user_id  int = null
)
AS
BEGIN
	SET NOCOUNT ON 
	DECLARE @client_id nvarchar(20)=null
	 SELECT @client_id = company_id FROM dbo.users_v where user_id=@user_id;
     SELECT vehicle_id, vehicle_plate_no FROM dbo.vehicles WHERE company_id= @client_id ; 
END
 

