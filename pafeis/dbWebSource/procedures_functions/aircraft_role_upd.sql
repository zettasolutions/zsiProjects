-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 5:18 PM
-- Description:	Aircraft role insert or update all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[aircraft_role_upd]
(
    @tt    aircraft_role_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  aircraft_role			= b.aircraft_role
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.aircraft_role a INNER JOIN @tt b
    ON a.aircraft_role_id = b.aircraft_role_id
    WHERE (
			isnull(a.aircraft_role,'')		<> isnull(b.aircraft_role,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.aircraft_role (
         aircraft_role
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        aircraft_role	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE aircraft_role_id IS NULL;
END

