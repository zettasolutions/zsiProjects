

CREATE PROCEDURE [dbo].[aircraft_class_upd]
(
    @tt    aircraft_class_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  aircraft_class			= b.aircraft_class
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.aircraft_class a INNER JOIN @tt b
    ON a.aircraft_class_id = b.aircraft_class_id
    WHERE (
			isnull(a.aircraft_class,'')		<> isnull(b.aircraft_class,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.aircraft_class (
         aircraft_class
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        aircraft_class	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE aircraft_class_id IS NULL;
END


