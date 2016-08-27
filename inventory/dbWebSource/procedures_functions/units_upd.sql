CREATE PROCEDURE [dbo].[units_upd]
(
    @tt    units_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  unit_sdesc   = b.unit_sdesc
			,unit_desc    = b.unit_desc
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.units a INNER JOIN @tt b
        ON a.unit_id = b.unit_id 
       WHERE (
				isnull(a.unit_sdesc,'') <> isnull(b.unit_sdesc,'')   
	   )

-- Insert Process

    INSERT INTO units (
         unit_sdesc
		,unit_desc 
        ,created_by
        ,created_date
        )
    SELECT 
        unit_sdesc
	   ,unit_desc 
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE unit_id IS NULL
END


  



