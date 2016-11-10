CREATE PROCEDURE [dbo].[systems_upd]
(
    @tt    systems_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  system_name  = b.system_name
			,system_desc  = b.system_desc
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.systems a INNER JOIN @tt b
        ON a.system_id = b.system_id 
       WHERE (
				isnull(a.system_name,'') <> isnull(b.system_name,'')   
			 OR isnull(a.system_desc,'') <> isnull(b.system_desc,'')   
	   )

-- Insert Process

    INSERT INTO systems (
         system_name
		,system_desc
        ,created_by
        ,created_date
        )
    SELECT 
         system_name
		,system_desc
        ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE system_id IS NULL
		AND system_name IS NOT NULL
		AND system_desc IS NOT NULL;
END


  


