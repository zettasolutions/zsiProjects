
CREATE PROCEDURE [dbo].[unit_of_measure_upd]
(
    @tt    unit_of_measure_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  unit_of_measure_code   = b.unit_of_measure_code
		,unit_of_measure_name	= b.unit_of_measure_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.unit_of_measure a INNER JOIN @tt b
    ON a.unit_of_measure_id = b.unit_of_measure_id
    WHERE (
			isnull(a.unit_of_measure_code,'')		<> isnull(b.unit_of_measure_code,'')  
		OR	isnull(a.unit_of_measure_name,'')		<> isnull(b.unit_of_measure_name,'')  
		OR	isnull(a.is_active,'')			        <> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.unit_of_measure (
         unit_of_measure_code 
		,unit_of_measure_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        unit_of_measure_code 
	   ,unit_of_measure_name	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE unit_of_measure_id IS NULL;
END


