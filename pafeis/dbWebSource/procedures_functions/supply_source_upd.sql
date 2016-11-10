
CREATE PROCEDURE [dbo].[supply_source_upd]
(
    @tt    supply_source_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  supply_source_name		= b.supply_source_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.supply_source a INNER JOIN @tt b
    ON a.supply_source_id = b.supply_source_id
    WHERE (
			isnull(a.supply_source_name,'')		<> isnull(b.supply_source_name,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.supply_source (
         supply_source_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        supply_source_name	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE supply_source_id IS NULL;
END


