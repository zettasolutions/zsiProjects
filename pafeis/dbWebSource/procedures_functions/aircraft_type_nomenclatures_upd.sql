

CREATE PROCEDURE [dbo].[aircraft_type_nomenclatures_upd]
(
    @tt    aircraft_type_nomenclatures_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_code_id			= b.item_code_id
	    ,aircraft_type_nomenclature_pid              = b.aircraft_type_nomenclature_pid
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.aircraft_type_nomenclatures a INNER JOIN @tt b
    ON a.aircraft_type_nomenclature_id = b.aircraft_type_nomenclature_id
    WHERE isnull(b.is_edited,'N')='Y'
	   
-- Insert Process
    INSERT INTO dbo.aircraft_type_nomenclatures (
         aircraft_type_id
		,item_code_id
		,aircraft_type_nomenclature_pid
        ,created_by
        ,created_date
        )
    SELECT 
        aircraft_type_id	
	   ,item_code_id
	   ,aircraft_type_nomenclature_pid
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE aircraft_type_nomenclature_id IS NULL
	AND aircraft_type_id IS NOT NULL
	AND item_code_id IS NOT NULL;
END


