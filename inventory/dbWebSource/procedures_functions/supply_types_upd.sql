

CREATE PROCEDURE [dbo].[supply_types_upd]
(
    @tt    supply_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  supply_type  = b.supply_type
            ,updated_by   = @user_id
            ,updated_date = GETDATE()
     FROM dbo.supply_types a INNER JOIN @tt b
        ON a.supply_type_id = b.supply_type_id  
       WHERE (
				isnull(a.supply_type,'') <> isnull(b.supply_type,'')   
	   )

-- Insert Process

    INSERT INTO supply_types (
         supply_type
        ,created_by
        ,created_date
        )
    SELECT 
        supply_type
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE supply_type_id IS NULL
END


  



