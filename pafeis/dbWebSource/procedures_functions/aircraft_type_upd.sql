
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 5:26 PM
-- Description:	Aircraft type insert or update all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[aircraft_type_upd]
(
    @tt    aircraft_type_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  aircraft_type			= b.aircraft_type
		,manufacturer_id		= b.manufacturer_id
		,origin_id				= b.origin_id
		,aircraft_class_id		= b.aircraft_class_id
		,aircraft_role_id   	= b.aircraft_role_id
		,introduced_year		= b.introduced_year
		,in_service				= b.in_service
		,note   				= b.note
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.aircraft_type a INNER JOIN @tt b
    ON a.aircraft_type_id = b.aircraft_type_id
    WHERE (
			isnull(a.aircraft_type,'')		<> isnull(b.aircraft_type,'')  
		OR	isnull(a.manufacturer_id,0)		<> isnull(b.manufacturer_id,0)  
		OR	isnull(a.origin_id,0)			<> isnull(b.origin_id,0)  
		OR	isnull(a.aircraft_class_id,0)	<> isnull(b.aircraft_class_id,0)  
		OR	isnull(a.aircraft_role_id,0)	<> isnull(b.aircraft_role_id,0)  
		OR	isnull(a.introduced_year,'')	<> isnull(b.introduced_year,'')  
		OR	isnull(a.in_service,0)			<> isnull(b.in_service,0)  
		OR	isnull(a.note,'')				<> isnull(b.note,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.aircraft_type (
         aircraft_type
		,manufacturer_id
		,origin_id
		,aircraft_class_id
		,aircraft_role_id
		,introduced_year
		,in_service
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        aircraft_type	
	   ,manufacturer_id
	   ,origin_id
	   ,aircraft_class_id
	   ,aircraft_role_id
	   ,introduced_year
	   ,in_service
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE aircraft_type_id IS NULL;
END


