CREATE FUNCTION [dbo].[getItemSerialNos] 
(
   @item_inv_id int
)
RETURNS VARCHAR(max)
AS
BEGIN
   DECLARE @return_var VARCHAR(max);
   DECLARE @Delimiter CHAR(2) 
   SET @Delimiter = ', '

   declare @tt as table (
     serial_no nvarchar(1000)
   )

   insert into @tt select serial_no from items where item_inv_id = @item_inv_id;

   SELECT @return_var = COALESCE(@return_var + @Delimiter,'') + f.serial_no
             FROM @tt f

   RETURN @return_var;

END

